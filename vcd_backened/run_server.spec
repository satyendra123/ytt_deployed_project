# -*- mode: python ; coding: utf-8 -*-
import os
from PyInstaller.utils.hooks import collect_all
from PyInstaller.utils.hooks import collect_data_files

# ---------------------------
# Paths
# ---------------------------
project_path = os.path.abspath(".")  # your project folder
pathex = [project_path]

# ---------------------------
# Hidden imports
# ---------------------------
hiddenimports = [
    'waitress', 'psutil', 'django', 'django.core', 'django.conf',
    'authentication', 'authentication.apps', 'authentication.urls',
    'accounts', 'accounts.apps', 'accounts.urls',
    'controller', 'controller.apps', 'controller.urls',
    'dashboard', 'dashboard.apps', 'dashboard.urls',
    'dj_rest_auth', 'dj_rest_auth.registration',
    'allauth', 'allauth.account', 'allauth.socialaccount',
    'rest_framework'
]

# ---------------------------
# Collect Django package files
# ---------------------------
datas = []
binaries = []
tmp_ret = collect_all('django')
datas += tmp_ret[0]
binaries += tmp_ret[1]
hiddenimports += tmp_ret[2]

# Optionally include your project data (templates/static)
datas += collect_data_files('anpr_backened')  # include your Django project folder

# ---------------------------
# Analysis
# ---------------------------
a = Analysis(
    ['run_server.py'],
    pathex=pathex,
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0
)

# ---------------------------
# PYZ
# ---------------------------
pyz = PYZ(a.pure, a.zipped_data, cipher=None)

# ---------------------------
# EXE
# ---------------------------
exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='run_server',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,  # safer
    console=True,  # set True for debugging, False for final build
)
