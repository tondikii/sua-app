package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const RequestIDHeader = "X-Request-ID"

// RequestID propagates or generates a correlation ID for every request.
// If the incoming request carries an X-Request-ID header that value is reused;
// otherwise a new UUID v4 is generated. The ID is echoed back in the response
// header and stored in the Gin context under the key "requestID".
func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		reqID := c.GetHeader(RequestIDHeader)
		if reqID == "" {
			reqID = uuid.NewString()
		}
		c.Set("requestID", reqID)
		c.Header(RequestIDHeader, reqID)
		c.Next()
	}
}
