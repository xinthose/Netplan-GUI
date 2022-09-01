#!/usr/bin/python
# -*- coding: utf-8 -*-

from pydantic import BaseModel
from typing import List  # needed for python 3.8 and below

class SetDate(BaseModel):
    ServerTime: str


class SubmitBridge(BaseModel):
    gateway: str
    addresses: List[str]
    nameservers: List[str]


class SubmitEth(BaseModel):
    gateway: str
    addresses: List[str]
    nameservers: List[str]
    deleteEth: bool


class SubmitWiFi(BaseModel):
    gateway: str
    addresses: List[str]
    nameservers: List[str]
    deleteWiFi: bool
    ssid: str
    ssidPassword: str


class UpdateStationWifi(BaseModel):
    enabled: str    # 1/0
    network_name: str
    network_password: str
    enable_bridge: str    # 1/0
    network_ap_gateway: str
