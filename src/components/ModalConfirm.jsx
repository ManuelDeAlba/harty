function ModalConfirm({ handleResult, texto, visible }){
    return(
        visible && (
            <div className="modal">
                <div className="modal__contenedor">
                    <p className="modal__texto">{texto}</p>
                    <div className="modal__botones">
                        <button className="modal__boton boton boton--outlined" onClick={() => handleResult(true)}>Aceptar</button>
                        <button className="modal__boton boton boton--filled" onClick={() => handleResult(false)}>Cancelar</button>
                    </div>
                </div>
            </div>
        )
    )
}

export default ModalConfirm;