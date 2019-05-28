define([
    'jquery',
    'underscore',
    'arches',
    'knockout', 
    'knockout-mapping', 
    'views/forms/base',
    'views/forms/sections/branch-list',
    'views/forms/sections/location-branch-list',
    'summernote'
], function ($, _, arches, ko, koMapping, BaseForm, BranchList, LocationBranchList) {
    return BaseForm.extend({
        initialize: function() {
            var self = this;
            var resourcetypeid = $('#resourcetypeid').val();
            var includeMap = (resourcetypeid !== 'ACTOR.E39');
            var includeSettings = !_.contains(['ACTOR.E39', 'ACTIVITY.E7', 'HERITAGE_RESOURCE_GROUP.E27', 'HISTORICAL_EVENT.E5'], resourcetypeid);
            var includeAdminAreas = (resourcetypeid !== 'ACTOR.E39');
            var includeParcels = !_.contains(['ACTOR.E39', 'ACTIVITY.E7', 'HISTORICAL_EVENT.E5'], resourcetypeid);
            var adminAreaTypeLookup = {};
            BaseForm.prototype.initialize.apply(this);
            

            if (includeAdminAreas) {
                var adminGovernateBranchList = new BranchList({
                    el: this.$el.find('#admin-governate-section')[0],
                    data: this.data,
                    dataKey: 'GOVERNATE.E53'
                });
                this.addBranchList(adminGovernateBranchList);

                var adminAreaBranchList = new BranchList({
                    el: this.$el.find('#admin-district-section')[0],
                    data: this.data,
                    dataKey: 'DISTRICT.E53'
                });
                this.addBranchList(adminAreaBranchList);
            }

            if (includeMap) {
                var locationBranchList = new LocationBranchList({
                    el: this.$el.find('#geom-list-section')[0],
                    data: this.data,
                    dataKey: 'SPATIAL_COORDINATES_GEOMETRY.E47'
                });

                this.addBranchList(locationBranchList);
            }

            if (includeParcels) {
                this.addBranchList(new BranchList({
                    el: this.$el.find('#parcel-section')[0],
                    data: this.data,
                    dataKey: 'PLACE_APPELLATION_CADASTRAL_REFERENCE.E44'
                }));
            }
                           
            this.addBranchList(new BranchList({
                el: this.$el.find('#address-section')[0],
                data: this.data,
                dataKey: 'PLACE_ADDRESS.E45'
            }));
           
                           
            this.addBranchList(new BranchList({
                el: this.$el.find('#locationcertainty-section')[0],
                data: this.data,
                dataKey: 'SITE_LOCATION_CERTAINTY_TYPE.E55',
                rules: true,
                validateBranch: function (nodes) {
                    return this.validateHasValues(nodes);
                }
            }));
                           
            this.addBranchList(new BranchList({
                el: this.$el.find('#size-section')[0],
                data: this.data,
                dataKey: 'SITE_SIZE_CERTAINTY_TYPE.E55',
                rules: true,
                validateBranch: function (nodes) {
                    return this.validateHasValues(nodes);
                }
            }));
                          
                           
            this.addBranchList(new BranchList({
                el: this.$el.find('#toposetting-section')[0],
                data: this.data,
                dataKey: 'PLACE_TOPOGRAPHY_TYPE.E55',
                rules: true,
                validateBranch: function (nodes) {
                    return this.validateHasValues(nodes);
                }                
                
            }));
                           
            this.addBranchList(new BranchList({
                el: this.$el.find('#grid_ID-section')[0],
                data: this.data,
                dataKey: 'ELEVATION.E54',
                rules: true,
                validateBranch: function (nodes) {
                    return this.validateHasValues(nodes);
                }
            }));
                           
            this.addBranchList(new BranchList({
                el: this.$el.find('#description-section')[0],
                data: this.data,
                dataKey: 'DESCRIPTION_OF_LOCATION.E62',
                singleEdit: true
            }));
        }
    });
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