package utils

import (
	"github.com/go-playground/validator/v10"
)

type ErrorResponse struct {
	Field string `json:"field"`
	Tag string `json:"tag"`
	Value string `json:"value,omitempty"`
}
var validate = validator.New()

func ValidStruct(s interface{}) []*ErrorResponse {
	var errors []*ErrorResponse
	err := validator.New().Struct(s)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			var element ErrorResponse
			element.Field = err.StructField()
			element.Tag = err.Tag()
			element.Value = err.Param()
			errors = append(errors, &element)
		}
	}
	return errors
}