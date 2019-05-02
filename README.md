# YHMP
Yemen Heritage Management Platform
YHMP


## Installation

1. Create virtual environment
2. Clone arches and install into virtual env. Need to do it this way so it picks up the requirements file and does 
the django override.
    ```bash
    git clone https://github.com/eamena-oxford/arches_v1
    cd arches_v1
    python setup.py install
    cd ..
    ```
2. Then install extra dependencies related to YHMP, this includes the edited version of arches_hip
    ```bash
    git clone https://github.com/eamena-oxford/YHMP
    cd YHMP/
    pip install -r requirements.txt
    ```
4. Create settings_local.py file in eamena/
5. Add gdal and geos settings to this file and set the database user and password.
E.g.
    ```python
    from arches_hip.settings import DATABASES
    
    GDAL_LIBRARY_PATH = '/local/eamena/lib/libgdal.so'
    GEOS_LIBRARY_PATH = '/local/eamena/lib/libgeos_c.so'
    
    DATABASES['default']['PASSWORD'] = 'PASSWORD'
    DATABASES['default']['USER'] = 'USER'
    ```
6. If there's a problem reading the GEOS version id, need to edit the `site-packages/django/contrib/gis/geos/libgeos.py` file. 
Replace 
    ```
    r'((rc(?P<release_candidate>\d+))|dev)?-CAPI-(?P<capi_version>\d+\.\d+\.\d+)( r\d+)?$'
    ```
    with
    ```
    r'((rc(?P<release_candidate>\d+))|dev)?-CAPI-(?P<capi_version>\d+\.\d+\.\d+)( r\d+)?.*$'
    ```

8. Setup database and elasticsearch
    ```bash
    python manage.py packages -o setup
    python manage.py packages -o start_elasticsearch
    python manage.py packages -o install
    ```
    
## Resource Graphs

To add a new field into a resource graph, with a dropdown list.

1. Add the concept to the resource.nodes.csv and resource.edges.csv with the appropriate relationships.
E.g:
    ```text
    # eamena/source_data/resource_graphs/ACTOR.E39_nodes.csv
    83,ORGANISATION_TYPE.E55,ACTOR.E39,domains
    84,ORGANISATION_TYPE_AUTHORITY_DOCUMENT.E32,ORGANISATION_TYPE.E55,
    
    # eamena/source_data/resource_graphs/ACTOR.E39_edges.csv
    10,83,Directed,91,P2,1.0
    83,84,Directed,92,-P71,1.0
    ```
2. Create a new Authority Document file that contains the dropdown options. 
E.g:
    ```text
    # eamena/source_data/concepts/authority_files/ORGANISATION_TYPE_AUTHORITY_DOCUMENT.csv
    conceptid,PrefLabel,AltLabels,ParentConceptid,ConceptType,Provider
    ORGANISATION_TYPE:1,Group,,ORGANISATION_TYPE_AUTHORITY_DOCUMENT.csv,Index,Eamena
    ORGANISATION_TYPE:2,Individual,,ORGANISATION_TYPE_AUTHORITY_DOCUMENT.csv,Index,Eamena
    ORGANISATION_TYPE:3,Unknown,,ORGANISATION_TYPE_AUTHORITY_DOCUMENT.csv,Index,Eamena
    ```
3. Link that file to the appropriate concept by adding it to the ENTITY_TYPE_X_ADOC file.
E.g:
    ```text
    # eamena/source_data/concepts/authority_files/ENTITY_TYPE_X_ADOC.csv
    ORGANISATION_TYPE.E55,ORGANISATION_TYPE_AUTHORITY_DOCUMENT.csv,Eamena
    ```
4. Install the changes into the database and ES index.
    ```bash
    python manage.py packages -o install
    ```