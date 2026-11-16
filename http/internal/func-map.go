package app

import (
	"strconv"
	"text/template"
	"time"
	"lipa/internal/locale"
)

const niceLookingDatetimeFormat = "2.01.2006 15:04:05"

/* FuncMap for HTML templates */
var templateFuncMap = template.FuncMap{
	/* Locale */
	"l": func(id string) string {
		return locale.Get(id)
	},
	/* Current year */
	"getYear": func() string {
		return strconv.Itoa(time.Now().Year())
	},
	/* Human-readable date formatting */
	"formatDate": func(t time.Time) string {
		return t.Format(niceLookingDatetimeFormat)
	},
}
