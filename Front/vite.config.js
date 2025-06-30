import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        page1: 'Games.html',
        page2: 'game_card.html',
        page3: 'register.html',
        page4: 'login.html',
        page5: 'userpage.html',
      }
    }
  }
})