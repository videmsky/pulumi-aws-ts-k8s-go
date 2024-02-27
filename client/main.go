package main

import (
	"os"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/contrib/static"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	helloMessage := os.Getenv("HELLO_MESSAGE")
	r := gin.Default()
	r.LoadHTMLFiles("views/index.html")

	r.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "index.html", gin.H{
        "HelloMessage": helloMessage,
    })
	})
	r.Use(static.Serve("/", static.LocalFile("./views", true)))
	
	r.GET("/hello", func(c *gin.Context) {
		c.String(200, helloMessage)
	})

	r.Run(":8889")
}
