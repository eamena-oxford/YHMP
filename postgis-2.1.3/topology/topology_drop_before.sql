












-- $Id: topology_drop_before.sql.in 12013 2013-10-09 06:45:26Z strk $
-- PostGIS - Spatial Types for PostgreSQL
-- http://www.postgis.org
--
-- Copyright (C) 2012 Regina Obe <lr@pcorp.us>
-- This is free software; you can redistribute and/or modify it under
-- the terms of the GNU General Public Licence. See the COPYING file.
--
--  
-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
-- These are functions where the argument names may have changed  --
-- so have to be dropped before upgrade can happen for 9.0+ --
-- argument names changed --
-- we might want to take toTopoGeom one out before release since
-- I don't think too many people installed the bad name
DROP FUNCTION IF EXISTS topology.toTopoGeom(Geometry, varchar, int, float8);

-- used to be in public, will now be moved to topology
DROP FUNCTION IF EXISTS postgis_topology_scripts_installed();

