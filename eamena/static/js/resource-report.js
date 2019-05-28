require([
    'jquery',
    'views/crypto/components/core',
    'underscore',
    'arches',
    'bootstrap',
    'views/map',
    'openlayers', 
    'views/crypto/components/cipher-core',
    'knockout',
    'utils',
    'views/crypto/components/enc-base64',
    'views/crypto/rollups/aes',
    'views/crypto/components/mode-cfb',
    'highcharts'
], function($,crypto, _, arches, bootstrap, MapView, ol, ciphercore, ko, utils, encbase, aes, cfb, Highcharts) {
    var drawCharts = function(type, data) {
        var categories = [];
        if (type === 'condition') {
            categories = [
                'unknown',
                'destroyed',
                'very bad',
                'poor',
                'fair',
                'good'
            ];
        } else if (type === 'extent') {
            categories = [
                'unknown',
                '91-100%',
                '61-90%',
                '31-60%',
                '11-30%',
                '1-10%',
                'No Visible/Known'
            ]
        }
        var graphdata = JSON.parse(data);
        for (let res of graphdata) {
            let date = new Date(res[0]);
            console.log(date);
            res[0] = date.getTime();
            var indexnum = categories.indexOf(res[1]);
            console.log(indexnum, categories[indexnum]);
            res[1] = indexnum;
        }
        var chartOptions = {
            chart: {
                type: 'spline'
            },
            title: {
                text: null
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b %Y',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                categories: categories,
                title: {
                    text: type.charAt(0).toUpperCase() + type.slice(1)
                },
                min: 1,
                max: categories.length - 1
            },
            legend: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    return Highcharts.dateFormat('%Y-%m-%d %H:%M', new Date(this.x)) + ': <b>' + categories[this.y] + '</b>'
                }
            },
            series: [{
                name: 'MyData',
                data: graphdata
            }]
        };
        var mychart = new Highcharts.Chart(type + '-graph', chartOptions);
    };

    var ReportView = Backbone.View.extend({

        initialize: function(options) { 
            var resize;
            var self = this;

            var resource_geometry = $('#resource_geometry');
            var geom_encr = JSON.parse(resource_geometry.val());
            var key = CryptoJS.enc.Hex.parse(geom_encr.key);
            var iv = CryptoJS.enc.Hex.parse(geom_encr.iv);
            var cipher = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(geom_encr.ciphertext)
            }),
                result = CryptoJS.AES.decrypt(cipher, key, {iv: iv, mode: CryptoJS.mode.CFB});
                
            if(resource_geometry.length > 0){
                var geom = JSON.parse(result.toString(CryptoJS.enc.Utf8));
                this.map = new MapView({
                    el: $('#map')
                });
            
            var logged = geom_encr.editor
            if (logged === 'false') {        
                var dragPan;
                this.map.map.getInteractions().forEach(function(interaction) {
                  if (interaction instanceof ol.interaction.DragPan) {
                    dragPan = interaction;
                  }
                }, this);
                if (dragPan) {
                  this.map.map.removeInteraction(dragPan);
                };
            };              
            ko.applyBindings(this.map, $('#basemaps-panel')[0]);

                this.highlightFeatures(JSON.parse(result.toString(CryptoJS.enc.Utf8)));
                this.zoomToResource('1');
                var hideAllPanels = function(){
                    $("#basemaps-panel").addClass("hidden");

                    //Update state of remaining buttons
                    $("#inventory-basemaps")
                        .removeClass("arches-map-tools-pressed")
                        .addClass("arches-map-tools")
                        .css("border-bottom-left-radius", "1px");
                };

                //Inventory-basemaps button opens basemap panel
                $("#inventory-basemaps").click(function (){
                    if ($(this).hasClass('arches-map-tools-pressed')) {
                        hideAllPanels();
                    } else {
                        $("#basemaps-panel").removeClass("hidden");

                        //Update state of current button and adjust position
                        $("#inventory-basemaps")
                            .addClass("arches-map-tools-pressed")
                            .removeClass("arches-map-tools")
                            .css("border-bottom-left-radius", "5px");
                    }
                });

                $(".basemap").click(function (){ 
                    var basemap = $(this).attr('id');
                    _.each(self.map.baseLayers, function(baseLayer){ 
                        baseLayer.layer.setVisible(baseLayer.id == basemap);
                    });
                    hideAllPanels();
                    if (basemap ==='Aerial') {
                        $("#imagery-date").show();
                    }else {
                        $("#imagery-date").hide();
                    };
                });

                //Close Button
                $(".close").click(function (){ 
                    hideAllPanels();
                });
               
            }else{
                $('.block-description').css('marginTop', '-40px');
                $('#map-container').hide();
            }

            var resize = function() {
                var header = $('.breadcrumbs').outerHeight() + $('.header').outerHeight();
                $('#report-body').height($(window).height() - header);
            };            

            $('body').removeClass('scroll-y');
            resize();
            $(window).resize(resize); 

            _.each($('.report-item-list'), function(list) {
                if ($(list).find('.report-list-item').length === 0) {
                    $(list).find('.empty-message').show();
                }
            });
            console.log($('#condition-graph-data').val());
            drawCharts('condition', $('#condition-graph-data').val());
            drawCharts('extent', $('#extent-graph-data').val());

        },

        zoomToResource: function(resourceid){
            this.cancelFitBaseLayer = true;
            var feature = this.selectedFeatureLayer.getSource().getFeatureById(resourceid);
            if(feature.getGeometry().getGeometries().length > 1){
                var extent = feature.getGeometry().getExtent();
                var minX = extent[0];
                var minY = extent[1];
                var maxX = extent[2];
                var maxY = extent[3];
                var polygon = new ol.geom.Polygon([[[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY], [minX, minY]]]);
                this.map.map.getView().fitGeometry(polygon, this.map.map.getSize(), {maxZoom:18}); 
            }else{
                this.map.map.getView().fitGeometry(feature.getGeometry().getGeometries()[0], this.map.map.getSize(), {maxZoom:18});                    
            }
        },

        highlightFeatures: function(geometry){
            var source, geometries;
            var self = this;
            var f = new ol.format.GeoJSON({defaultDataProjection: 'EPSG:4326'});

            if(!this.selectedFeatureLayer){
                var zIndex = 0;
                var styleCache = {};

                var style = function(feature, resolution) {
                    return [new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(66, 139, 202, 0)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(179, 0, 0, 0.9)',
                            width: 3
                        }),
                        image: new ol.style.Circle({
                            radius: 10,
                            fill: new ol.style.Fill({
                                color: 'rgba(66, 139, 202, 0)'
                            }),
                            stroke: new ol.style.Stroke({
                                color: 'rgba(179, 0, 0, 0.9)',
                                width: 3
                            })
                        })
                    })];
                };                     
                this.selectedFeatureLayer = new ol.layer.Vector({
                    source: new ol.source.GeoJSON(),
                    style: style
                });
                this.map.map.addLayer(this.selectedFeatureLayer);  
            }
            this.selectedFeatureLayer.getSource().clear();

            feature = {
                'type': 'Feature',
                'id': '1',
                'geometry':  geometry
            };

            this.selectedFeatureLayer.getSource().addFeature(f.readFeature(feature, {featureProjection: 'EPSG:3857'}));
        }
    });
    new ReportView();
});

$(function($) {
    PlusMinus = true;	
  $('#plusminus').click(function() {

    var wasPlay = $(this).hasClass('fa-plus-square');
    $(this).removeClass('fa-plus-square fa-minus-square');
    var klass = wasPlay ? 'fa-minus-square' : 'fa-plus-square';
    $(this).addClass(klass)
    if (PlusMinus == true) {
        $('#tobehidden').show();
    } else {
        $('#tobehidden').hide();
    }
    PlusMinus = !PlusMinus;
    }); 
    
  });
