package models

import (
	"errors"

	"gorm.io/gorm"
)

type Receipt struct {
	gorm.Model
	NRIC          string `json:"nric" gorm:"type:varchar(255);not null;unique;uniqueIndex:nric_walletaddress_idx"`
	WalletAddress string `json:"wallet_address" gorm:"type:varchar(255);not null;uniqueIndex:nric_walletaddress_idx"`
}

func (r *Receipt) BeforeCreate(tx *gorm.DB) (err error) {
	var result int64
	tx.Model(&Receipt{}).Where("nric = ? OR wallet_address = ?", r.NRIC, r.WalletAddress).Count(&result)
	if result > 0 {
		return errors.New("either NRIC or WalletAddress already exists")
	}
	return
}
