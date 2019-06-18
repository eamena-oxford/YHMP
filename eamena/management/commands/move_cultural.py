from django.core.management.base import BaseCommand, CommandError
from arches.app.models import models as archesmodels
from arches.app.models.entity import Entity
from arches.app.models.resource import Resource
from optparse import make_option

class Command(BaseCommand):

    def handle(self, *args, **options):

        lookedat = 0
        edited = 0

        schema = Resource.get_mapping_schema('HERITAGE_RESOURCE_GROUP.E27')

        for E27 in archesmodels.Entities.objects.filter(entitytypeid='HERITAGE_RESOURCE_GROUP.E27'):
            lookedat += 1
            resource = Resource().get(E27.entityid)
            #print "NEW RESOURCE"
            #print resource
            culturals = []
            parents = []
            certainties = []
            for entity in resource.flatten():
                if str(entity.entitytypeid) == 'CULTURAL_PERIOD.E55':
                    #print "CULTURAL", entity
                    culturals.append(entity)
                    parent = entity.get_parent()
                    if str(parent.entitytypeid) == 'PHASE_TYPE_ASSIGNMENT.E17':
                        parents.append(parent)
                    #print parent
                if str(entity.entitytypeid) == 'CULTURAL_PERIOD_CERTAINTY_TYPE.E55':
                    #print "CERTAINTY", entity
                    certainties.append(entity)
            if culturals and parents:
                edited += 1
                print '.',
                # if len(culturals) == 1:
                #     continue
                #print "Going to do something here."
                for parent in parents:
                    parent._delete()
                for i, cultural in enumerate(culturals):
                    allres = []
                    #print cultural.value
                    newres = Resource()
                    newres.create_from_mapping('HERITAGE_RESOURCE_GROUP.E27', schema['CULTURAL_SUBPERIOD.E55']['steps'], 'CULTURAL_SUBPERIOD.E55', cultural.value)
                    allres.append(newres)
                    certainty = certainties[i]
                    #print certainty.value
                    newres = Resource()
                    newres.create_from_mapping('HERITAGE_RESOURCE_GROUP.E27', schema['CULTURAL_SUBPERIOD_CERTAINTY_TYPE.E55']['steps'], 'CULTURAL_SUBPERIOD_CERTAINTY_TYPE.E55', certainty.value)
                    allres.append(newres)
                    mapping_graph = allres[0]
                    for mapping in allres[1:]:
                        mapping_graph.merge(mapping)
                    #print "Mapping graph:"
                    #print mapping_graph.flatten()
                    resource.merge_at(mapping_graph, mapping_graph.entitytypeid)
                resource.save()
                #print resource.flatten()

                #break
        print ""
        print "Looked through %s resources and edited %s" % (lookedat, edited)


