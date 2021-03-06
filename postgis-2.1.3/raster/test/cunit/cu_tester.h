/**********************************************************************
 * $Id$
 *
 * PostGIS - Spatial Types for PostgreSQL
 * http://postgis.refractions.net
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 **********************************************************************/

#include "rt_api.h"

#define PG_TEST(test_func) { #test_func, test_func }
#define MAX_CUNIT_MSG_LENGTH 512

/* Contains the most recent error message generated by rterror. */
char cu_error_msg[MAX_CUNIT_MSG_LENGTH+1];

/* Resets cu_error_msg back to blank. */
void cu_error_msg_reset(void);

/* free raster object */
void cu_free_raster(rt_raster raster);

/* helper to add bands to raster */
rt_band cu_add_band(
	rt_raster raster,
	rt_pixtype pixtype,
	int hasnodata, double nodataval
);
