package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// 1. Root Route
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Sua API is running. Check /ping or /api/categories")
	})

	// 2. Health Check
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong! Sua server is awake 💖",
		})
	})

	// 3. Endpoint Categories
	r.GET("/api/categories", func(c *gin.Context) {
		categories := []string{
			"Makan",
			"Nonton",
			"Ngafe",
			"Badminton",
			"WFC",
			"Game Cafe",
		}
		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data":   categories,
		})
	})

	// 4. Endpoint Explore
	r.GET("/api/explore", func(c *gin.Context) {
		category := c.Query("category")
		city := c.Query("city")

		if category == "" || city == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Query 'category' and 'city' must be provided! Example: /api/explore?category=Ngafe&city=Jakarta",
			})
			return
		}

		// Logic mapping keyword for Gmaps
		var searchKeyword string
		switch category {
		case "Ngafe":
			searchKeyword = "Cafe"
		case "Makan":
			searchKeyword = "Restoran"
		case "Nonton":
			searchKeyword = "Bioskop"
		default:
			searchKeyword = category
		}

		gmapsQuery := fmt.Sprintf("%s di %s", searchKeyword, city)

		// Mock response data from Gmaps
		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"info":   fmt.Sprintf("Mencari %s...", gmapsQuery),
			"data": []map[string]interface{}{
				{
					"name":    fmt.Sprintf("%s Seru 1 di %s", category, city),
					"address": "Jl. Contoh No. 123",
					"rating":  4.5,
				},
				{
					"name":    fmt.Sprintf("%s Asik 2 di %s", category, city),
					"address": "Jl. Sampel No. 456",
					"rating":  4.7,
				},
			},
		})
	})

	fmt.Println("Starting Sua server on http://localhost:8080 ...")
	r.Run(":8080")
}