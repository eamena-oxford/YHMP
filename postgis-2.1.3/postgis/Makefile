# **********************************************************************
# * $Id$
# *
# * PostGIS - Spatial Types for PostgreSQL
# * http://postgis.refractions.net
# * Copyright 2008 Mark Cave-Ayland
# *
# * This is free software; you can redistribute and/or modify it under
# * the terms of the GNU General Public Licence. See the COPYING file.
# *
# **********************************************************************

POSTGIS_PGSQL_VERSION=93
MODULE_big=postgis-2.1
MODULEDIR=contrib/$(MODULE_big)

# Files to be copied to the contrib/ directory
SQL_built=postgis.sql uninstall_postgis.sql postgis_upgrade_20_21.sql postgis_upgrade_21_minor.sql legacy.sql uninstall_legacy.sql legacy_minimal.sql legacy_gist.sql uninstall_sfcgal.sql
DATA=../spatial_ref_sys.sql

# SQL objects (files requiring pre-processing)
SQL_objs=postgis.sql legacy.sql legacy_minimal.sql

GEOM_BACKEND_OBJ = lwgeom_geos.o
SFCGAL_BACKEND_OBJ = lwgeom_sfcgal.o

ifeq (,sfcgal)
DATA_built=$(SQL_built) sfcgal.sql
SQL_OBJS=$(SQL_objs) sfcgal.sql
BACKEND_OBJ=$(GEOM_BACKEND_OBJ) $(SFCGAL_BACKEND_OBJ)
else
BACKEND_OBJ=$(GEOM_BACKEND_OBJ)
DATA_built=$(SQL_built)
SQL_OBJS=$(SQL_objs)
endif



# SQL preprocessor
SQLPP = /usr/bin/cpp -w -traditional-cpp -P

# PostgreSQL objects
PG_OBJS= \
	postgis_module.o \
	lwgeom_accum.o \
	lwgeom_spheroid.o \
	lwgeom_ogc.o \
	lwgeom_functions_analytic.o \
	lwgeom_inout.o \
	lwgeom_functions_basic.o \
	lwgeom_btree.o \
	lwgeom_box.o \
	lwgeom_box3d.o \
	$(BACKEND_OBJ) \
	lwgeom_backend_api.o \
	lwgeom_geos_prepared.o \
	lwgeom_geos_clean.o \
	lwgeom_geos_relatematch.o \
	lwgeom_export.o \
	lwgeom_in_gml.o \
	lwgeom_in_kml.o \
	lwgeom_in_geohash.o \
	lwgeom_in_geojson.o \
	lwgeom_triggers.o \
	lwgeom_dump.o \
	lwgeom_dumppoints.o \
	lwgeom_functions_lrs.o \
	long_xact.o \
	lwgeom_sqlmm.o \
	lwgeom_rtree.o \
	lwgeom_transform.o \
	gserialized_typmod.o \
	gserialized_gist_2d.o \
	gserialized_gist_nd.o \
	gserialized_estimate.o \
	geography_inout.o \
	geography_btree.o \
	geography_measurement.o \
	geography_measurement_trees.o \
	geometry_inout.o

# Objects to build using PGXS
OBJS=$(PG_OBJS)

# Libraries to link into the module (proj, geos)
#
# Note: we specify liblwgeom.a directly in SHLIB_LINK rather than using
# -L... -l options to prevent issues with some platforms trying to link
# to an existing liblwgeom.so in the PostgreSQL $libdir supplied by an
# older version of PostGIS, rather than with the static liblwgeom.a 
# supplied with newer versions of PostGIS
PG_CPPFLAGS += -I../liblwgeom -I../libpgcommon  -I/usr/local/include  -I/usr/include/libxml2   -fPIC
SHLIB_LINK_F = ../libpgcommon/libpgcommon.a ../liblwgeom/.libs/liblwgeom.a  -L/usr/local/lib  -lgeos_c -lproj  -ljson-c -lxml2 

# Add SFCGAL Flags if defined
ifeq (,sfcgal)
PG_CPPFLAGS += 
SHLIB_LINK_F += 
endif

# Extra files to remove during 'make clean'
EXTRA_CLEAN=$(SQL_OBJS) \
	uninstall_postgis.sql \
	uninstall_legacy.sql \
	uninstall_sfcgal.sql \
	postgis_upgrade_20_21.sql.in \
	postgis_upgrade_20_21.sql \
	postgis_upgrade_21_minor.sql 

# PGXS information
PG_CONFIG = /usr/bin/pg_config 
PGXS := /usr/lib/postgresql/9.3/lib/pgxs/src/makefiles/pgxs.mk
include $(PGXS)

# Set PERL _after_ the include of PGXS
PERL=/usr/bin/perl

# This is to workaround a bug in PGXS 8.4 win32 link line,
# see http://trac.osgeo.org/postgis/ticket/1158#comment:57
SHLIB_LINK := $(SHLIB_LINK_F) $(SHLIB_LINK)

# PGXS override feature. The ability to allow PostGIS to install itself
# in a versioned directory is only available in PostgreSQL >= 8.5. To
# do this by default on older PostgreSQL versions, we need to override
# the existing PGXS targets.
#
# Once PostgreSQL 8.5 becomes the minimum supported version, this entire
# section and its associated Makefile.pgxs should be removed.
PGXSOVERRIDE = 0
ifeq ($(PGXSOVERRIDE),1)
	include Makefile.pgxs
endif

# If REGRESS=1 passed as a parameter, change the default install paths
# so that no prefix is included. This allows us to relocate to a temporary
# directory for regression testing.
ifeq ($(REGRESS),1)
        bindir=/bin
        pkglibdir=/lib
        datadir=/share
        datamoduledir=contrib/postgis
endif

# Make all PostGIS objects depend upon liblwgeom, so that if an underlying
# change is made, a PostGIS rebuild is triggered.
#
# Also they are all dependent on postgis_config.h 
# and thus postgis_svn_revision.h
#
$(PG_OBJS): ../liblwgeom/.libs/liblwgeom.a ../libpgcommon/libpgcommon.a ../postgis_config.h ../postgis_svn_revision.h

../postgis_svn_revision.h:
	$(MAKE) -C .. postgis_svn_revision.h

../liblwgeom/.libs/liblwgeom.a:
	make -C ../liblwgeom liblwgeom.la

../libpgcommon/libpgcommon.a:
	make -C ../libpgcommon libpgcommon.a

# Borrow the $libdir substitution from PGXS but customise by running the preprocessor
# and adding the version number
%.sql: %.sql.in
	$(SQLPP) -I../libpgcommon $< | grep -v '^#' | \
	$(PERL) -lpe "s'MODULE_PATHNAME'\$$libdir/postgis-2.1'g" > $@

postgis_upgrade_20_21.sql.in: postgis_drop_before.sql postgis.sql postgis_drop_after.sql
	cat $^ > $@
postgis_upgrade_20_21.sql: postgis_upgrade_20_21.sql.in ../utils/postgis_proc_upgrade.pl 
	$(PERL) ../utils/postgis_proc_upgrade.pl $< 2.0 > $@
	
#this is same as 20_21 until we release a 2.1.0	
postgis_upgrade_21_minor.sql: postgis_upgrade_20_21.sql
	cp $< $@

# Generate any .sql.in files from .sql.in.c files by running them through the SQL pre-processor 
#$(SQL_OBJS): %.in: %.in.c
# $(SQLPP) -I../libpgcommon $< | grep -v '^#' > $@

# SQL objects are also dependent on postgis_config.h for PostgreSQL version
$(SQL_OBJS): ../postgis_config.h ../postgis_svn_revision.h

#postgis.sql.in: sqldefines.h long_xact.sql.in.c geography.sql.in.c 

uninstall_postgis.sql: postgis.sql ../utils/create_undef.pl 
	$(PERL) ../utils/create_undef.pl $< $(POSTGIS_PGSQL_VERSION) > $@

uninstall_legacy.sql: legacy.sql ../utils/create_undef.pl 
	$(PERL) ../utils/create_undef.pl $< $(POSTGIS_PGSQL_VERSION) > $@

uninstall_sfcgal.sql: sfcgal.sql ../utils/create_undef.pl 
	$(PERL) ../utils/create_undef.pl $< $(POSTGIS_PGSQL_VERSION) > $@

distclean: clean
	rm -f Makefile
