#!/usr/bin/env bash

supervisorctl stop server
supervisorctl clear all
supervisorctl start server
