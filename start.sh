#!/bin/bash

echo "Redis Monitor Dashboard"

case "$1" in
    "clean")
        echo "Starting with clean containers..."
        docker-compose down
        docker-compose build
        docker-compose up -d
        ;;
    "rebuild")
        echo "Rebuilding and starting containers..."
        docker-compose build
        docker-compose up -d
        ;;
    "restart")
        echo "Restarting existing containers..."
        docker-compose restart
        ;;
    "reset-data")
        echo "Removing all Redis data and restarting..."
        docker-compose down
        docker volume rm redis-moitor-dashboard_redis_data
        docker-compose up -d
        ;;
    *)
        echo "Starting or creating containers..."
        docker-compose up -d
        ;;
esac

echo "Access the dashboard at: http://localhost"