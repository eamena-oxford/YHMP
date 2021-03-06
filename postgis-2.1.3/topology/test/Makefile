DATABASE=postgis_topo_regress

PSQL=psql
PERL=/usr/bin/perl
GEOS_NUMERIC_VERSION=30402

all: 
	@echo "Use 'make check' to run all tests"

# TODO: make edit_topology.sql into a proper test
edit:
	$(PSQL) -X -f edit_topology.sql $(DATABASE)


topo_predicates.sql: predicates.sql.in
	cpp -P -traditional-cpp predicates.sql.in | sed -e 's:@COLUMN@:feature:g;s:@SCHEMA@:topology.:g' > topo_predicates.sql

load_topology.sql: load_topology.sql.in
	@cpp -P -traditional-cpp load_topology.sql.in | sed -e 's:@SRID@:-1:g' > load_topology.sql

load_topology-4326.sql: load_topology.sql.in
	@cpp -P -traditional-cpp load_topology.sql.in | sed -e 's:@SRID@:4326:g' > load_topology-4326.sql

clean distclean:
	rm -f topo_predicates.sql load_topology.sql load_topology-4326.sql regress/topogeo_addlinestring_expected

TESTS = regress/legacy_validate.sql regress/legacy_predicate.sql \
	regress/legacy_invalid.sql regress/sqlmm.sql \
	regress/legacy_query.sql regress/addnode.sql \
	regress/addedge.sql regress/addface.sql \
	regress/addface2.5d.sql \
	regress/addtopogeometrycolumn.sql \
	regress/polygonize.sql \
	regress/st_addisoedge.sql \
	regress/st_addisonode.sql \
	regress/st_addedgemodface.sql \
	regress/st_addedgenewfaces.sql \
	regress/st_changeedgegeom.sql \
	regress/st_createtopogeo.sql \
	regress/st_getfacegeometry.sql \
	regress/st_getfaceedges.sql \
	regress/st_modedgeheal.sql \
	regress/st_modedgesplit.sql \
	regress/st_newedgeheal.sql \
	regress/st_newedgessplit.sql \
	regress/st_remedgenewface.sql \
	regress/st_remedgemodface.sql \
	regress/st_simplify.sql \
	regress/topoelement.sql \
	regress/topoelementarray_agg.sql \
	regress/topogeo_addlinestring.sql \
	regress/topogeo_addpoint.sql \
	regress/topogeo_addpolygon.sql \
	regress/topogeometry_type.sql \
	regress/topojson.sql \
	regress/topo2.5d.sql \
	regress/totopogeom.sql \
	regress/droptopology.sql \
	regress/copytopology.sql \
	regress/createtopogeom.sql \
	regress/createtopology.sql \
	regress/gml.sql \
	regress/getnodebypoint.sql \
	regress/getedgebypoint.sql \
	regress/getfacebypoint.sql \
	regress/getringedges.sql \
	regress/gettopogeomelements.sql \
	regress/layertrigger.sql \
	regress/validatetopology.sql

TESTS_EXPECTED = $(TESTS:.sql=_expected)

regress/topogeo_addlinestring_expected: Makefile
ifeq ($(shell expr $(GEOS_NUMERIC_VERSION) ">" 30308),1)
	cp regress/topogeo_addlinestring_expected_newsnap regress/topogeo_addlinestring_expected
else
	cp regress/topogeo_addlinestring_expected_oldsnap regress/topogeo_addlinestring_expected
endif
	

check: topo_predicates.sql load_topology.sql load_topology-4326.sql $(TESTS) $(TESTS_EXPECTED)
	$(MAKE) -C ../../regress staged-install
	$(PERL) ../../regress/run_test.pl --topology $(RUNTESTFLAGS) $(TESTS)
	$(PERL) ../../regress/run_test.pl --upgrade --topology $(RUNTESTFLAGS) $(TESTS)
