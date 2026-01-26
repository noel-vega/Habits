package users

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type UserService struct {
	UserRepo *UserRepo
}

func NewUserService(db *sqlx.DB) *UserService {
	return &UserService{
		UserRepo: NewUserRepo(db),
	}
}

func (svc *UserService) CreateUser(params CreateUserParams) error {
	existingUser, err := svc.UserRepo.GetUserByEmail(params.Email)
	fmt.Printf("USER: %v+\n", existingUser)

	if err != nil {
		if !errors.Is(err, sql.ErrNoRows) {
			return err
		}
	}

	if existingUser != nil {
		return fmt.Errorf("%s:%w", params.Email, ErrEmailExists)
	}

	err = svc.UserRepo.CreateUser(params)
	if err != nil {
		return err
	}
	return nil
}
