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