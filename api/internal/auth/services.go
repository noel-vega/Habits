package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jmoiron/sqlx"
	"github.com/noel-vega/habits/api/internal/users"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	UserService users.UserService
}

func NewAuthService(db *sqlx.DB) *AuthService {
	return &AuthService{
		UserService: *users.NewUserService(db),
	}
}

func (s *AuthService) GenerateToken(userID int, duration time.Duration) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(duration).Unix(),
		"iat":     time.Now().Unix(),
	})

	// TODO: secret key
	tokenStr, err := token.SignedString([]byte("secret"))
	if err != nil {
		return "", err
	}
	return tokenStr, nil
}

func (s *AuthService) SignUp(params users.CreateUserParams) (string, error) {
	hashBytes, err := bcrypt.GenerateFromPassword([]byte(params.Password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	hashedPassword := string(hashBytes)
	params.Password = hashedPassword

	user, err := s.UserService.CreateUser(params)
	if err != nil {
		return "", err
	}

	return s.GenerateToken(user.ID, 1*time.Minute)
}

var ErrInvalidCredentials = errors.New("invalid email or password")

type SignInParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignInTokenPair struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

func (s *AuthService) SignIn(params SignInParams) (*SignInTokenPair, error) {
	user, err := s.UserService.UserRepo.GetUserByEmailWithPassword(params.Email)
	if err != nil {
		// TODO: check for fatal errors
		return nil, ErrInvalidCredentials
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(params.Password))
	if err != nil {
		return nil, ErrInvalidCredentials
	}
	accessToken, err := s.GenerateToken(user.ID, 1*time.Minute)
	if err != nil {
		return nil, err
	}

	refreshToken, err := s.GenerateToken(user.ID, 1*time.Hour)
	if err != nil {
		return nil, err
	}

	tokens := &SignInTokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}
	return tokens, nil
}
