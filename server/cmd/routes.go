package main

import (
	"github.com/alvinvoo/nft-portal-server/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func setupRoutes(app *fiber.App) {
	// Enable CORS for all routes.
	app.Use(cors.New())

	app.Post("/receipt", handlers.CreateReceipt)
}
