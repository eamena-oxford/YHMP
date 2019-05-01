import os
import arches_hip.setup as setup
from arches.db.utils import execute_sql_file
from django.conf import settings

def install(path_to_source_data_dir=None):
    setup.install()
    load_eamena_extra_sql()

def load_resource_graphs():
    setup.resource_graphs.load_graphs(break_on_error=True)

def load_authority_files(path_to_files=None):
    setup.authority_files.load_authority_files(path_to_files, break_on_error=True)

def load_resources(external_file=None):
    setup.load_resources(external_file)

def load_eamena_extra_sql():
    print "loading custom SQL"
    sql_dir = os.path.join(settings.PACKAGE_ROOT, "install", "prepackage_sql")
    for f in os.listdir(sql_dir):
        if not f.endswith(".sql"):
            continue
        sql = os.path.join(sql_dir, f)
        print "executing", sql
        execute_sql_file(sql)