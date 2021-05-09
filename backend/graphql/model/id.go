package model

import (
	"fmt"
	"io"
	"strconv"

	"github.com/99designs/gqlgen/graphql"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Convert internal ObjectID value to hex string for outgoing values
func MarshalID(id primitive.ObjectID) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		io.WriteString(w, strconv.Quote(id.Hex()))
	})
}

// Create ObjectID from incoming string value
func UnmarshalID(v interface{}) (primitive.ObjectID, error) {
	str, ok := v.(string)
	if !ok {
		return primitive.NilObjectID, fmt.Errorf("ids must be strings")
	}
	objectId, err := primitive.ObjectIDFromHex(str)
	if err != nil {
		return primitive.NilObjectID, fmt.Errorf("objectid conversion from string failed")
	}
	return objectId, nil
}
