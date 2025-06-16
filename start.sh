#!/bin/bash

echo "Redis Monitor Dashboard"


COMPOSE_FILE="docker-compose.yml"


if [ "$1" == "combined" ]; then
    COMPOSE_FILE="docker-compose.combined.yml"
    shift 
fi


case "$1" in
    "clean")
        echo "Starting with clean containers using $COMPOSE_FILE..."
        docker-compose -f $COMPOSE_FILE down
        docker-compose -f $COMPOSE_FILE build
        docker-compose -f $COMPOSE_FILE up -d
        ;;
    "rebuild")
        echo "Rebuilding and starting containers using $COMPOSE_FILE..."
        docker-compose -f $COMPOSE_FILE build
        docker-compose -f $COMPOSE_FILE up -d
        ;;
    "restart")
        echo "Restarting existing containers using $COMPOSE_FILE..."
        docker-compose -f $COMPOSE_FILE restart
        ;;
    "reset-data")
        echo "Removing all Redis data and restarting using $COMPOSE_FILE..."
        docker-compose -f $COMPOSE_FILE down
        docker volume rm redis-moitor-dashboard_redis_data
        docker-compose -f $COMPOSE_FILE up -d
        ;;
    *)
        echo "Starting or creating containers using $COMPOSE_FILE..."
        docker-compose -f $COMPOSE_FILE up -d
        ;;
esac

echo "Access the dashboard at: http://localhost"