package main

import (
	"fmt"
	"log"
	"maps"
	"net/http"
	"slices"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type Habit struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Contribution struct {
	ID      int       `json:"id"`
	Date    time.Time `json:"date"`
	HabitID int       `json:"habitId"`
}

type HabitWithContributions struct {
	ID            int            `json:"id"`
	Name          string         `json:"name"`
	Description   string         `json:"description"`
	Contributions []Contribution `json:"contributions"`
}

type CreateHabitParams struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type HabitsRepository interface {
	Create(habit Habit) error
	List() []Habit
}

type ContributionsRepository interface {
	List(habitID int) []Contribution
	Create(habitID int, date time.Time)
	Delete(habitID int, date time.Time)
}

type HabitContributionIdentity struct {
	HabitID int       `json:"habitId"`
	Date    time.Time `json:"date"`
}

type InMemoryHabitsRepo struct {
	Habits map[int]Habit
}

func (r *InMemoryHabitsRepo) List() []Habit {
	habits := slices.Collect(maps.Values(r.Habits))
	return habits
}

func (r *InMemoryHabitsRepo) Create(params CreateHabitParams) Habit {
	habit := Habit{
		ID:          len(r.Habits),
		Name:        params.Name,
		Description: params.Description,
	}
	r.Habits[habit.ID] = habit
	return habit
}

func NewInMemoryHabitsRepo() *InMemoryHabitsRepo {
	return &InMemoryHabitsRepo{
		Habits: map[int]Habit{
			0: {ID: 0, Name: "Test", Description: "Dummy Habit"},
		},
	}
}

type InMemoryContributionsRepo struct {
	Contributions map[int][]Contribution
}

func (r *InMemoryContributionsRepo) List(habitID int) []Contribution {
	return r.Contributions[habitID]
}

func (r *InMemoryContributionsRepo) Create(params HabitContributionIdentity) {
	newContribution := Contribution{
		ID:      len(r.Contributions[params.HabitID]),
		HabitID: params.HabitID,
		Date:    params.Date,
	}
	r.Contributions[params.HabitID] = append(
		r.Contributions[params.HabitID],
		newContribution,
	)
}

func (r *InMemoryContributionsRepo) Delete(params HabitContributionIdentity) {
	fmt.Println(params.Date)
	r.Contributions[params.HabitID] = slices.DeleteFunc(
		r.Contributions[params.HabitID],
		func(c Contribution) bool {
			return c.Date.Year() == params.Date.Year() && c.Date.Month() == params.Date.Month() && c.Date.Day() == params.Date.Day()
		})
}

func NewInMemoryContributionsRepo() *InMemoryContributionsRepo {
	return &InMemoryContributionsRepo{
		Contributions: map[int][]Contribution{
			0: {
				{ID: 0, HabitID: 0, Date: time.Date(2026, 1, 1, 0, 0, 0, 0, time.Local)},
			},
		},
	}
}

func main() {
	// this Pings the database trying to connect
	// use sqlx.Open() for sql.Open() semantics
	db, err := sqlx.Connect("postgres", "user=foo dbname=bar sslmode=disable")
	if err != nil {
		log.Fatalln(err)
	}
	// Create a Gin router with default middleware (logger and recovery)
	r := gin.Default()
	r.Use(cors.Default())

	habitsRepo := NewInMemoryHabitsRepo()
	contributionsRepo := NewInMemoryContributionsRepo()

	// Define a simple GET endpoint
	r.GET("/ping", func(c *gin.Context) {
		// Return JSON response
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.GET("/habits", func(c *gin.Context) {
		// Return JSON response
		habits := []HabitWithContributions{}
		for _, habit := range habitsRepo.List() {
			habits = append(habits, HabitWithContributions{
				ID:            habit.ID,
				Name:          habit.Name,
				Description:   habit.Description,
				Contributions: contributionsRepo.List(habit.ID),
			})
		}
		c.JSON(http.StatusOK, habits)
	})

	r.POST("/habits", func(c *gin.Context) {
		var data CreateHabitParams
		c.Bind(&data)
		newHabit := habitsRepo.Create(data)
		contributionsRepo.Contributions[newHabit.ID] = []Contribution{}
		habit := HabitWithContributions{
			ID:            newHabit.ID,
			Name:          newHabit.Name,
			Description:   newHabit.Description,
			Contributions: []Contribution{},
		}
		c.JSON(http.StatusOK, habit)
	})

	r.POST("/habits/:habitID/contributions", func(c *gin.Context) {
		habitID, _ := strconv.Atoi(c.Param("habitID"))
		data := HabitContributionIdentity{
			HabitID: habitID,
		}
		c.Bind(&data)
		contributionsRepo.Create(data)
	})

	r.DELETE("/habits/:habitID/contributions", func(c *gin.Context) {
		habitID, _ := strconv.Atoi(c.Param("habitID"))
		data := HabitContributionIdentity{
			HabitID: habitID,
		}
		c.Bind(&data)
		contributionsRepo.Delete(data)
	})

	// Start server on port 8080 (default)
	// Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
	if err := r.Run(); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}
}
