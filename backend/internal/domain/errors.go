package domain

import "errors"

// Sentinel errors returned by service and repository layers.
// HTTP handlers map these to appropriate status codes via errors.Is().
var (
	ErrNotFound             = errors.New("resource not found")
	ErrUnauthorized         = errors.New("unauthorized")
	ErrForbidden            = errors.New("forbidden: insufficient permissions")
	ErrConflict             = errors.New("resource already exists")
	ErrInvalidInput         = errors.New("invalid input")
	ErrUsernameTaken        = errors.New("username is already taken")
	ErrNotParticipant       = errors.New("user is not a participant of this trip")
	ErrNotCreator           = errors.New("only the trip creator can perform this action")
	ErrTripAlreadyFixed     = errors.New("trip date is already fixed")
	ErrInvitationNotPending = errors.New("invitation is no longer pending")
	ErrAlreadyVoted         = errors.New("user has already voted for this candidate")
	ErrVoteNotFound         = errors.New("vote not found")
)
