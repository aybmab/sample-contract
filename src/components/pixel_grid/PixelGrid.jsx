import React, { Component } from 'react';
import './PixelGrid.css'
import Modal from 'react-modal';

const DIMENSION = 20
const COLORS = {
  0       : { hex:'#ffffff' }, // white?
  1       : { hex: '#76c4Ae', label: 'Green' }, // green
  2       : { hex: '#7CE0F9', label: 'Blue' }, // blue
  3       : { hex: '#CABD80', label: 'Yellow' }, // yellow
  4       : { hex: '#D86C70', label: 'Red' }, // red
}

class PixelGrid extends Component {
  constructor(props){
    super(props)

    // const pixels = {}
    // const colors = Object.keys(COLORS)
    // for (var i = 0; i < DIMENSION; i++) {
    //   pixels[i] = {}
    //   for (var j = 0; j < DIMENSION; j++) {
    //     const random_color = Math.floor(Math.random() * colors.length)
    //     pixels[i][j] = COLORS[colors[random_color]]
    //   };
    // };

    this.state = {
      selected_coords_x: null,
      selected_coords_y: null,
      selected_new_color: 0,
    }
  }

  setSelectedCoords(i, j){
    this.setState({
      selected_coords_x: i,
      selected_coords_y: j
    })
  }

  closeModal() {
    this.setSelectedCoords(null, null)
  }

  async updateCoordsColor() {
    const {
      selected_coords_x,
      selected_coords_y,
      selected_new_color
    } = this.state

    // const updated_pixels = Object.assign({}, pixels)
    // this.setState({
    //   pixels: updated_pixels,
    //   selected_coords_x: null,
    //   selected_coords_y: null,
    //   new_color_text: '',
    // })

    // TODO use function from parent
    
    console.log("calling function")
    await this.props.claimPixel(selected_coords_x, selected_coords_y, selected_new_color)
    console.log("done")
  }

  render() {
    const {
      board,
      is_loading
    } = this.props

    const {
      selected_coords_x,
      selected_coords_y,
      selected_new_color,
    } = this.state

    if (is_loading){
      return <div> is loading board... </div>
    }


    const rows = Object.keys(board)

    return (
      <div>
        <table>
          <tbody>
            {
              rows.map(row => {
                const cols = Object.keys(board[row])
                return <tr key={row}>
                  {
                    cols.map(col => {
                      const pixel = board[row][col]
                      const is_selected = (selected_coords_x === row) && (selected_coords_y === col)
                      return (
                        <td
                          key={`${row}-${col}`}
                          style={{background: COLORS[pixel].hex}}
                          onClick={this.setSelectedCoords.bind(this, row, col)}
                        />
                      )
                    })
                  }
                </tr>
              })
            }
          </tbody>
        </table>

        <Modal
          isOpen={selected_coords_x !== null}
          onRequestClose={this.closeModal.bind(this)}
          style={{
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-50%',
              transform             : 'translate(-50%, -50%)'
            }
          }}
          contentLabel="Example Modal"
        >
          <h2>Update Cell @ ({selected_coords_y}, {selected_coords_x})</h2>
          {
            Object.keys(COLORS).map(color_index => {

              if (color_index === "0"){
                return undefined
              }

              const color = COLORS[color_index]
              return (
                <div className="radio">
                  <label>
                    <input type="radio" onChange={e => {
                      this.setState({selected_new_color: color_index})
                    }} checked={color_index === selected_new_color} />
                    {color.label}
                  </label>
                </div>
              )
            })
          }
          <br/>
          <button onClick={this.updateCoordsColor.bind(this)}> Submit </button>
        </Modal>
      </div>

    );
  }

}

export default PixelGrid;
