package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

func TestHealthCheck(t *testing.T) {
	_ = godotenv.Load()

	testConfig := GetConfig()
	assert.Equal(t, testConfig.Environment, "test", "only run tests in test environment")

	router := setup(testConfig)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/health", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, "ok", w.Body.String())
}
