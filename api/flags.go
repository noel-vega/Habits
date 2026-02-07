package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

var flags = map[string]bool{
	"habits": true,
	"mail":   false,
	"todos":  false,
	"users":  false,
}

func FlagsHandler(c *gin.Context) {
	c.JSON(http.StatusOK, flags)
}
