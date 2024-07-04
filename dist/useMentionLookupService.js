import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";
export function useMentionLookupService(options) {
    const { queryString, trigger, searchDelay, items, onSearch, justSelectedAnOption, } = options;
    const debouncedQueryString = useDebounce(queryString, searchDelay);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState(null);
    // lookup in items (no search function)
    useEffect(() => {
        if (!items) {
            return;
        }
        if (trigger === null) {
            setResults([]);
            setQuery(null);
            return;
        }
        const mentions = Object.entries(items).find(([key]) => {
            return new RegExp(key).test(trigger);
        });
        if (!mentions) {
            return;
        }
        const result = !queryString
            ? [...mentions[1]]
            : mentions[1].filter((item) => {
                const value = typeof item === "string" ? item : item.value;
                return value.toLowerCase().includes(queryString.toLowerCase());
            });
        setResults(result);
        setQuery(queryString);
    }, [items, trigger, queryString]);
    // lookup by calling onSearch
    useEffect(() => {
        if (!onSearch) {
            return;
        }
        if (trigger === null || debouncedQueryString === null) {
            setResults([]);
            setQuery(null);
            return;
        }
        setLoading(true);
        setQuery(debouncedQueryString);
        onSearch(trigger, (justSelectedAnOption === null || justSelectedAnOption === void 0 ? void 0 : justSelectedAnOption.current) ? "" : debouncedQueryString)
            .then((result) => setResults(result))
            .finally(() => setLoading(false));
        if (justSelectedAnOption === null || justSelectedAnOption === void 0 ? void 0 : justSelectedAnOption.current) {
            justSelectedAnOption.current = false;
        }
    }, [debouncedQueryString, onSearch, trigger, justSelectedAnOption]);
    return useMemo(() => ({ loading, results, query }), [loading, results, query]);
}
