package com.vtm.character_sheet.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class WebConfig {

    @Bean
    public FilterRegistrationBean<CacheHeaderFilter> cacheHeaderFilter() {
        FilterRegistrationBean<CacheHeaderFilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(new CacheHeaderFilter());
        bean.addUrlPatterns("/*");
        bean.setOrder(Integer.MIN_VALUE); // run first
        return bean;
    }

    static class CacheHeaderFilter implements Filter {
        @Override
        public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
                throws IOException, ServletException {
            HttpServletRequest request = (HttpServletRequest) req;
            HttpServletResponse response = (HttpServletResponse) res;
            String path = request.getRequestURI();

            if (path.startsWith("/assets/")) {
                // Hashed assets — cache 1 year
                response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
            } else if (path.equals("/") || path.equals("/index.html") || !path.startsWith("/api/")) {
                // HTML pages — never cache
                response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                response.setHeader("Pragma", "no-cache");
                response.setHeader("Expires", "0");
            }

            chain.doFilter(req, res);
        }
    }
}
