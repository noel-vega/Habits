package todos

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type Handler struct {
	TodosRepo *TodosRepo
}

func NewHandler(db *sqlx.DB) *Handler {
	return &Handler{
		TodosRepo: NewTodosRepo(db),
	}
}

func (handler *Handler) ListTodos(c *gin.Context) {
	todos, err := handler.TodosRepo.List()
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, todos)
}
