python_home = '/home/remotesec/webserver'

import sys
import site

#python_version = '.'.join(map(str, sys.version_info[:2]))
site_packages = python_home + '/lib/python3.6/site-packages'

site.addsitedir(site_packages)

sys.path.insert(0, "/var/www/html/python_progs/load_central")

from rest import app as application

