package handlers

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strings"

	"github.com/alvinvoo/nft-portal-server/database"
	"github.com/alvinvoo/nft-portal-server/models"
	"github.com/gofiber/fiber/v2"
)

func CreateReceipt(c *fiber.Ctx) error {
	receipt := new(models.Receipt)
	if err := c.BodyParser(receipt); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Convert NRIC and WalletAddress to uppercase
	receipt.NRIC = strings.ToUpper(receipt.NRIC)
	receipt.WalletAddress = strings.ToUpper(receipt.WalletAddress)

	// Check if NRIC and WalletAddress are empty
	if len(receipt.NRIC) == 0 || len(receipt.WalletAddress) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "NRIC and WalletAddress cannot be empty",
		})
	}

	result := database.DB.Db.Create(&receipt)

	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": result.Error.Error(),
		})
	}

	// Create a string with NRIC and WalletAddress
	// Did not take directly from c.Body() because API Body param keys is case-insensitive
	data := fmt.Sprintf("NRIC=%s&WalletAddress=%s", receipt.NRIC, receipt.WalletAddress)

	// Hash the data using SHA-256
	hash := sha256.Sum256([]byte(data))

	// Convert the hash to a hexadecimal string
	hashedData := hex.EncodeToString(hash[:])

	return c.Status(200).JSON(fiber.Map{
		"receipt": hashedData,
	})
}
