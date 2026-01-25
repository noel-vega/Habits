package users

import "github.com/jmoiron/sqlx"

type UserRepo struct {
	DB *sqlx.DB
}

func NewUserRepo(db *sqlx.DB) *UserRepo {
	return &UserRepo{
		DB: db,
	}
}

func (r *UserRepo) GetUserByEmail(email string) (*UserNoPassword, error) {
	user := &UserNoPassword{}
	query := `SELECT * FROM users WHERE email = $1`
	err := r.DB.Get(user, query, email)
	if err != nil {
		return nil, err
	}

	return user, nil
}
