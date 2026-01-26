// Package auth
package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/noel-vega/habits/api/internal/users"
)

type Handler struct {
	UserService *users.UserService
}

func NewHandler(db *sqlx.DB) *Handler {
	return &Handler{
		UserService: users.NewUserService(db),
	}
}

func (h *Handler) SignUp(c *gin.Context) {
	data := users.CreateUserParams{}
	err := c.Bind(&data)
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	err = h.UserService.CreateUser(data)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
}
