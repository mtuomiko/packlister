package model

type Packlist struct {
	ID          string      `json:"id" bson:"_id,omitempty"`
	Name        string      `json:"name"`
	Description *string     `json:"description"`
	UserID      string      `json:"user" bson:"user"`
	Categories  []*Category `json:"categories"`
}
