#############################################################################
# $Id: Makefile.in 12060 2013-10-28 19:44:03Z dustymugs $
#
# Copyright (c) 2009 Sandro Santilli <strk@keybit.net>
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software Foundation,
# Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
#############################################################################

AR=ar rs

CC=gcc
LIBLWGEOM_LDFLAGS=../../liblwgeom/.libs/liblwgeom.a
LIBLWGEOM_CFLAGS=-I../../liblwgeom
LIBGDAL_CFLAGS=-I/usr/include/gdal
LIBGDAL_LDFLAGS=-L/usr/lib -lgdal
GEOS_LDFLAGS=-L/usr/local/lib -lgeos_c
PROJ_LDFLAGS= -lproj
LDFLAGS=$(LIBLWGEOM_LDFLAGS) $(LIBGDAL_LDFLAGS) $(PROJ_LDFLAGS) $(GEOS_LDFLAGS)
CFLAGS=-g -O2  -fPIC -DPIC  -Wall -Wmissing-prototypes $(LIBLWGEOM_CFLAGS) $(LIBGDAL_CFLAGS)  -I/usr/local/include

# Standalone RTCORE objects
RT_OBJS=rt_api.o
RT_LIB=librtcore.a
RT_HEADERS=rt_api.h

all: $(RT_LIB)

clean:
	rm -f $(RT_OBJS)
	rm -f $(RT_LIB)

distclean: clean
	rm -f Makefile

librtcore.a: $(RT_OBJS) $(RT_HEADERS)
	$(AR) $(RT_LIB) $(RT_OBJS)
