# **********************************************************************
# *
# * PostGIS - Spatial Types for PostgreSQL
# * http://postgis.refractions.net
# * Copyright 2008 Mark Cave-Ayland
# *
# * This is free software; you can redistribute and/or modify it under
# * the terms of the GNU General Public Licence. See the COPYING file.
# *
# **********************************************************************

# PGXS information
#
# Note that PGXS currently doesn't handle building FE executables, but we need
# the DESTDIR variable so we can get the correct install paths. 
# Hence we include the PGXS Makefile here, but ensure that we override the
# 'all' and 'install' targets with the ones we really want to use below.
PG_CONFIG = /usr/bin/pg_config
PGXS := /usr/lib/postgresql/9.3/lib/pgxs/src/makefiles/pgxs.mk
include $(PGXS)

# Set CFLAGS afer PGXS, otherwise it will get overwritten with the PGXS
# version which is not what we want. 
CC=gcc
CFLAGS=-I ../liblwgeom -g -O2  -fPIC -DPIC  -Wall -Wmissing-prototypes 
top_builddir = ..
SHELL = /bin/bash
INSTALL = $(SHELL) ../install-sh
LIBTOOL = $(SHELL) $(top_builddir)/libtool

# Filenames with extension as determined by the OS
PGSQL2SHP-CLI=pgsql2shp
SHP2PGSQL-CLI=shp2pgsql
SHP2PGSQL-GUI=shp2pgsql-gui

# PostgreSQL frontend CPPFLAGS and LDFLAGS (for compiling and linking with libpq)
PGSQL_FE_CPPFLAGS=-I/usr/include/postgresql
PGSQL_FE_LDFLAGS=-L/usr/lib/x86_64-linux-gnu -lpq

# iconv flags
ICONV_LDFLAGS= -lc
ICONV_CFLAGS=

# liblwgeom
LIBLWGEOM=../liblwgeom/liblwgeom.la

# GTK includes and libraries
GTK_CFLAGS =  
GTK_LIBS =  
GTK_WIN32_FLAGS = 
GTK_WIN32_RES = 

# GetText includes and libraries
GETTEXT_CFLAGS = 
GETTEXT_LDFLAGS =  
LANGUAGES = fr

# Built out CFLAGS with ICONV and GETTEXT
CFLAGS += $(GETTEXT_CFLAGS) $(ICONV_CFLAGS)

# If REGRESS=1 passed as a parameter, change the default install paths
# so that no prefix is included. This allows us to relocate to a temporary
# directory for regression testing.
ifeq ($(REGRESS),1)
	bindir=/bin
	pkglibdir=/lib
	datadir=/share
endif

# We test this variable later to see if we're building the GUI
gtk_build = 

# Common object files
SHPLIB_OBJS = shpopen.o dbfopen.o getopt.o shpcommon.o safileio.o

# The real parts of the Makefile
all: $(SHP2PGSQL-CLI) $(PGSQL2SHP-CLI) 

gui: $(SHP2PGSQL-GUI) $(SHP2PGSQL-CLI) 

shp2pgsql-gui.res: shp2pgsql-gui.rc shp2pgsql-gui.ico
	windres $< -O coff -o $@

# liblwgeom.a dependency to allow "make install" in 
# the loader/ subdirectory to work  
$(LIBLWGEOM):
	make -C ../liblwgeom

shp2pgsql-core.o: shp2pgsql-core.c shp2pgsql-core.h shpcommon.h
	$(CC) $(CFLAGS) -c $<

pgsql2shp-core.o: pgsql2shp-core.c pgsql2shp-core.h shpcommon.h
	$(CC) $(CFLAGS) $(PGSQL_FE_CPPFLAGS) -c $<

pgsql2shp-cli.o: pgsql2shp-cli.c pgsql2shp-core.h shpcommon.h
	$(CC) $(CFLAGS) $(PGSQL_FE_CPPFLAGS) -c $<

$(PGSQL2SHP-CLI): $(SHPLIB_OBJS) pgsql2shp-core.o pgsql2shp-cli.o $(LIBLWGEOM) 
	$(LIBTOOL) --mode=link \
	  $(CC) $(CFLAGS) $^ $(ICONV_LDFLAGS) $(PGSQL_FE_LDFLAGS) $(GETTEXT_LDFLAGS) -o $@ 

$(SHP2PGSQL-CLI): $(SHPLIB_OBJS) shp2pgsql-core.o shp2pgsql-cli.o $(LIBLWGEOM) 
	$(LIBTOOL) --mode=link \
	  $(CC) $(CFLAGS) $^ -o $@ $(GETTEXT_LDFLAGS) $(ICONV_LDFLAGS) 

shp2pgsql-gui.o: shp2pgsql-gui.c shp2pgsql-core.h shpcommon.h
	$(CC) $(CFLAGS) $(GTK_CFLAGS) $(PGSQL_FE_CPPFLAGS) -o $@ -c shp2pgsql-gui.c

$(SHP2PGSQL-GUI): $(SHPLIB_OBJS) shp2pgsql-core.o shp2pgsql-gui.o pgsql2shp-core.o $(LIBLWGEOM) $(GTK_WIN32_RES)
	$(LIBTOOL) --mode=link \
	  $(CC) $(CFLAGS) $(GTK_WIN32_FLAGS) $^ -o $@ \
	  $(GTK_LIBS) $(ICONV_LDFLAGS) $(PGSQL_FE_LDFLAGS) $(GETTEXT_LDFLAGS) 

installdir:
	@mkdir -p $(DESTDIR)$(bindir)

install: installdir 
ifdef gtk_build
	$(LIBTOOL) --mode=install $(INSTALL) $(SHP2PGSQL-GUI) "$(DESTDIR)$(bindir)/$(SHP2PGSQL-GUI)"
endif
	$(LIBTOOL) --mode=install $(INSTALL) $(PGSQL2SHP-CLI) "$(DESTDIR)$(bindir)/$(PGSQL2SHP-CLI)"
	$(LIBTOOL) --mode=install $(INSTALL) $(SHP2PGSQL-CLI) "$(DESTDIR)$(bindir)/$(SHP2PGSQL-CLI)"

uninstall:
	$(LIBTOOL) --mode=uninstall rm -f "$(DESTDIR)$(bindir)/$(PGSQL2SHP-CLI)"
	$(LIBTOOL) --mode=uninstall rm -f "$(DESTDIR)$(bindir)/$(SHP2PGSQL-CLI)"
	$(LIBTOOL) --mode=uninstall rm -f "$(DESTDIR)$(bindir)/$(SHP2PGSQL-GUI)"

check:
ifdef gtk_build
	make -C cunit check
endif

clean:
	rm -rf .libs
	rm -f *.o $(SHP2PGSQL-CLI) $(PGSQL2SHP-CLI) $(GTK_WIN32_RES) $(SHP2PGSQL-GUI)
	$(MAKE) -C cunit clean

distclean:
	$(MAKE) -C cunit distclean
	rm -f Makefile


#
# Internationalization targets. These are going to need some work and 
# love to land the files in the right places in all platforms.
#
pot: 
	xgettext -k_ shp2pgsql-core.c shp2pgsql-cli.c shp2pgsql-gui.c -o po/shp2pgsql.pot
	xgettext -k_ pgsql2shp-core.c pgsql2shp-cli.c -o po/pgsql2shp.pot

mo:
	for lang in $(LANGUAGES); do \
	  msgfmt -o po/shp2pgsql_$$lang.mo po/shp2pgsql_$$lang.po ; \
	done

install-mo:
ifneq (,$(LANGUAGES))
	for lang in $(LANGUAGES); do \
      $(INSTALL_DATA) po/shp2pgsql_$$lang.mo '$(localedir)'/$$lang/LC_MESSAGES/shp2pgsql.mo || exit 1; \
    done
endif
