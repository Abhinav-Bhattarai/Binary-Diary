import React from 'react';

export interface FORMINPUT {
    value: string;
    change: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type: 'text' | 'password'
    name: string
};

export interface FORMLABEL {
    name: string;
    html_for: string
};

export interface FORM {
    Submit: (event:React.FormEvent) => void
}