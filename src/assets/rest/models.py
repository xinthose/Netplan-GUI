#!/usr/bin/python
# -*- coding: utf-8 -*-

# models used by FastAPI for POST requests

from pydantic import BaseModel


class SetDate(BaseModel):
    ServerTime: str


class SubmitBridge(BaseModel):
    gateway: str
    addresses: list[str]
    nameservers: list[str]


class SubmitEth(BaseModel):
    gateway: str
    addresses: list[str]
    nameservers: list[str]
    deleteEth: bool


class SubmitWiFi(BaseModel):
    gateway: str
    addresses: list[str]
    nameservers: list[str]
    deleteWiFi: bool
    ssid: str
    ssidPassword: str


class UpdateStationWifi(BaseModel):
    enabled: str    # 1/0
    network_name: str
    network_password: str
    enable_bridge: str    # 1/0
    network_ap_gateway: str
