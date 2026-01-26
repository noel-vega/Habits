package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

func AttachRoutes(r *gin.Engine, db *sqlx.DB) {
	h := NewHandler(db)

	r.GET("/auth/signup", h.SignUp)
}
