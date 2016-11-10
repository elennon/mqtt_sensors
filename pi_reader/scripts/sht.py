#!/usr/bin/python
# EASY-INSTALL-ENTRY-SCRIPT: 'sht-sensor==16.2.0','console_scripts','sht'
__requires__ = 'sht-sensor==16.2.0'
import sys
from pkg_resources import load_entry_point

if __name__ == '__main__':
    sys.exit(
        load_entry_point('sht-sensor==16.2.0', 'console_scripts', 'sht')()
    )
