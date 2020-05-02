# COVID-19 (Coronavirus) spread simulator 🦠

--- 

- Modified to add the  "quarantine" state by Giuseppe Sucameli
    If a symptomatic person has the app installed, all the people having the app which had contacts with him are quarantined as well.


- Modified to add the  "app" factor by Marco Pierobon
    An infected person having the app installed stops moving, infected people having the app don't infect other people having the app.

---

Check simulations about how confinement people could help to stop spreading Coronavirus.

[Based on Washington Post Article: Why outbreaks like coronavirus spread exponentially, and how to “flatten the curve” - Washington Post](https://www.washingtonpost.com/graphics/2020/world/corona-simulator/)

## How to start

Install all the project dependencies with:
```
npm install
```

And start the development server with:
```
npm run dev
```

## Browser support

This project is using EcmaScript Modules, therefore, only browsers with this compatibility will work. (Sorry Internet Explorer 11 and old Edge users).

## Next content
- Customize strategies (number of static people and mortality)
- Customize colors
- Iframe support
- I18N
- New strategies
- Improve the code so I don't get so ashamed. 😳
