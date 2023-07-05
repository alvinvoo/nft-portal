package main

import (
	"github.com/alvinvoo/nft-portal-server/handlers"
	"github.com/gofiber/fiber/v2"
)

func setupRoutes(app *fiber.App) {
	app.Post("/receipt", handlers.CreateReceipt)
}
