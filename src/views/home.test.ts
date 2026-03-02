import { describe, it, expect, beforeEach } from "vitest";
import HomeView from "./HomeView.vue";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

describe("Home", () => {
    const router = createRouter({
        history: createWebHistory(),
        routes: [{ path: "/", component: HomeView }],
    });

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it("render the component correctly", () => {
        const wrapper = mount(HomeView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find("h1").text()).toContain("ENCUENTRA EL TALENTO EN ESPAÑA");
        expect(wrapper.find("p").text()).toBe("Conectando a las futuras estrellas del fútbol con los mejores ojeadores y clubes de la península.");
    });

    it("debe tener un botón de buscar", () => {
        const wrapper = mount(HomeView, { global: { plugins: [router] } });
        expect(wrapper.find("button").exists()).toBe(true);
    });

    it("debe tener un input de búsqueda", () => {
        const wrapper = mount(HomeView, { global: { plugins: [router] } });
        expect(wrapper.find("input").exists()).toBe(true);
    });

    it("debe mostrar el texto de clasificación", () => {
        const wrapper = mount(HomeView, { global: { plugins: [router] } });
        expect(wrapper.text()).toContain("Ver clasificación");
    });
});