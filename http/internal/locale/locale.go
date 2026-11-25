package locale

var strings = map[string]string{
	/* Log in page */
	"Login": "Вход",
	"Greeting": "Последний шанс снять бахилы",
	"Username": "Имя пользователя",
	"Org": "Организация",
	"SelectOrg": "Выберите организацию",
	"Password": "Пароль",
	"RememberMe": "Запомнить меня",
	"LogInAsUser": "Войти как пользователь",
	"LogIn": "Войти",
	"LogInFailed": "Попробуйте ещё раз",
	/* Common */
	"Ok": "Ок",
	"Cancel": "Отмена",
	/* Navbar */
	"Templates": "Файлики",
	"Orgs": "Организации",
	"Forms": "Формы",
	"Reports": "Отчёты",
	"Admin": "Администрирование",
	"LoggedInAs": "Вы зашли как",
	"LogOut": "Выйти",
	"ConfirmLogout": "Выйти из системы?",
	/* XLSX */
	"UploadXLSX": "Загрузить .xlsx",
}

func Get(id string) string {
	if strings[id] == "" {
		panic("Missing string " + id)
	}
	return strings[id]
}
