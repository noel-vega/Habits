package users

import "github.com/jmoiron/sqlx"

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
	if err != nil {
		return err
	}

	if existingUser != nil {
		return err
	}

	err = svc.UserRepo.CreateUser(params)
	if err != nil {
		return err
	}
	return nil
}
