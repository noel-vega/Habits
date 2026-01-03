#!/bin/bash
migrate -database "postgres://habits:habits@localhost:5432/habits?sslmode=disable" -path migrations up
