# GPT Text Converter Chrome Extension  
設定済み文字列+選択文字列をGPT-3.5にリクエストを飛ばして  
帰ってきた文字列を画面上に表示するChrome拡張機能。

GPT-4と一緒に作りました  
最高にWIP  
まずReactで全部書き直したい  

## 仕様書(byGPT)

### 1. overview
A Chrome extension that sends selected portions of text to be converted and displayed. The user can select text in a page, select a conversion method, and the selected text can be converted and displayed. In addition, users can register their own conversion methods.

### 2. Purpose
To create an extension that allows users to convert selected text in real-time according to a user-specified conversion method, and to allow users to manage their own conversion methods.

### 3. Functional Requirements
- Capable of retrieving the selected text.
- Popup appears in the lower right corner of the cursor at the moment the text is selected
- Pop-up allows the user to select a pre-defined conversion method.
- Conversion methods are ordered from the top.
- The selected conversion method converts the text and displays the result in another pop-up component.
- Users can register their own conversion methods "by string
- The registered conversion methods can be managed in the UI
- "manifest_version": create with 3
