define(['jquery', 
    'underscore', 
    'knockout-mapping', 
    'views/forms/base', 
    'views/forms/sections/branch-list',
    'bootstrap-datetimepicker',], 
    function ($, _, koMapping, BaseForm, BranchList) {
        return BaseForm.extend({
            initialize: function() {
                BaseForm.prototype.initialize.apply(this);                
                
                var self = this;
                var date_picker = $('.datetimepicker').datetimepicker({pickTime: false});
                date_picker.on('dp.change', function(evt){
                    $(this).find('input').trigger('change'); 
                });

                // Will set certainty to N/A if chosen type is Unknown
                var site_function = $('#site-function-type');
                site_function.on('change', function(evt) {
                    self.checkUnknown(evt, $('#site-function-certainty'));
                });

                // Will set certainty to N/A if chosen period is Unknown
                $('#cultural-period').on('change', function(evt) {
                    self.checkUnknown(evt, $('#cultural-period-certainty'));
                });

                this.addBranchList(new BranchList({
                    el: this.$el.find('#names-section')[0],
                    data: this.data,
                    dataKey: 'NAME.E41',
                    validateBranch: function (nodes) {
                        var valid = true;
                        var primaryname_count = 0;
                        var primaryname_conceptid = this.viewModel.primaryname_conceptid;
                        _.each(nodes, function (node) {
                            if (node.entitytypeid === 'NAME.E41') {
                                if (node.value === ''){
                                    valid = false;
                                }
                            }
                            if (node.entitytypeid === 'NAME_TYPE.E55') {
                                if (node.value === primaryname_conceptid){
                                    _.each(self.viewModel['branch_lists'], function (branch_list) {
                                        _.each(branch_list.nodes, function (node) {
                                            if (node.entitytypeid === 'NAME_TYPE.E55' && node.value === primaryname_conceptid) {
                                                valid = false;
                                            }
                                        }, this);
                                    }, this);
                                }
                            }
                        }, this);
                        return valid;
                    }
                }));


                this.addBranchList(new BranchList({
                    el: this.$el.find('#subjects-section')[0],
                    data: this.data,
                    dataKey: 'SITE_FUNCTION_TYPE.E55',
                    rules: true,
                    validateBranch: function (nodes) {
                        return this.validateHasValues(nodes);
                    }
                }));

      
                this.addBranchList(new BranchList({
                    el: this.$el.find('#overall-certainty-section')[0],
                    data: this.data,
                    dataKey: 'SITE_OVERALL_ARCHAEOLOGICAL_CERTAINTY_TYPE.E55',
                    rules: true,
                    validateBranch: function (nodes) {
                         return this.validateHasValues(nodes);
                    }
                }));
                                
                               
                this.addBranchList(new BranchList({
                     el: this.$el.find('#culturalperiod-section')[0],
                     data: this.data,
                     dataKey: 'PERIODIZATION_ASSIGNMENT.E13',
                     rules: true,
                     validateBranch: function (nodes) {
                         if (!this.validateHasValues(nodes)) {
                             var period = 0;
                             var subperiod = 0;
                             _.each(nodes, function (node) {
                                 if (node.entitytypeid.indexOf('SUBPERIOD') !== -1) {
                                     if (node.value !== '') {
                                         subperiod += 1;
                                     }
                                 }else{
                                     if (node.value !== '') {
                                         period += 1;
                                     }
                                 }
                             }, this);
                             if (period === 1 || subperiod === 1) {
                                 return false;
                             }
                             return true;
                         }else{
                             return true;
                         }
                     }
                }));
         
                this.addBranchList(new BranchList({
                     el: this.$el.find('#phase-section')[0],
                     data: this.data,
                     dataKey: 'TIME-SPAN_PHASE.E52',
                     validateBranch: function (nodes) {
                          return true;
                          return this.validateHasValues(nodes);
                     }
                }));
                               

                this.addBranchList(new BranchList({
                    el: this.$el.find('#assessment-section')[0],
                    data: this.data,
                    dataKey: 'ASSESSMENT_TYPE.E55',
                    rules: true,
                    validateBranch: function (nodes) {
                        return this.validateHasValues(nodes);
                    }
                }));
                               
                this.addBranchList(new BranchList({
                    el: this.$el.find('#site_ID-section')[0],
                    data: this.data,
                    dataKey: 'SITE_ID.E42',
                    validateBranch: function (nodes) {
                          return this.validateHasValues(nodes);
                    }
                }));
                  
                this.addBranchList(new BranchList({
                    el: this.$el.find('#sitemorph-section')[0],
                    data: this.data,
                    dataKey: 'SITE_MORPHOLOGY_TYPE.E55',
                    rules: true,
                    validateBranch: function (nodes) {
                         return this.validateHasValues(nodes);
                    }
                }));
                               
                               

                               
            }
        });
    }
);

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